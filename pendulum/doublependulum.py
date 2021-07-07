from numpy import sin, cos
import numpy as np
import scipy.integrate as integrate
import sympy as sp


class DoublePendulum:
    """
        Author: Ky Heon
        Email: kyheon12@gmail.com
    """

    def __init__(self, i_state, lengths=(1, 1), masses=(1, 1), optimize=True):
        """
            The parameter i_state is the initial angle and omega that each arm of the pendulum is at.
            It is a list of size 4 in the format: [angle1, omega1, angle2, omega2].
            The optimize flag was created to increase the speed of the physics calculations in the program
            by using pre-solved equations of motion
        """
        self.optimize = optimize
        self.masses = masses
        self.lengths = lengths
        self.origin = (0, 0)
        self.time_elapsed = 0
        self.state = np.asarray(i_state, dtype='float') * np.pi / 180
        self.angles = (self.state[0], self.state[2])  # a1, a2
        self.omegas = (self.state[1], self.state[3])  # w1, w2

    def get_position(self):
        """
            get_position returns the x and y locations of each mass and the pivot point (origin) of the pendulum.
            The returned objects are each a list of size 3 in the format: [origin, loc_mass1, loc_mass2]
        """
        (l1, l2, a1, a2) = self.lengths + self.angles
        x = np.asarray([self.origin[0], l1 * sin(a1), l1 * sin(a1) + l2 * sin(a2)])
        y = np.asarray([self.origin[1], -l1 * cos(a1), -l1 * cos(a1) - l2 * cos(a2)])
        return x, y

    def calculate_energy(self):
        V = self.get_potential_energy()
        T = self.get_kinetic_energy()
        return T + V

    def get_potential_energy(self):
        """
            The potential energy of the pendulum system is due to gravity, so the sum of the mgh of each mass.
            This is calculated by a dot product between a mass vector and a height position vector, scaled by g
        """
        (m1, m2, l1, l2, a1, a2) = self.masses + self.lengths + self.angles
        g = 9.8
        y = np.asarray([self.origin[1], -l1 * cos(a1), -l1 * cos(a1) - l2 * cos(a2)])
        PE = g * y.dot([0, m1, m2])  # dot product is potential energy
        return PE

    def get_kinetic_energy(self):
        """
            The kinetic energy of the pendulum system is the sum of the 0.5mv^2 for each mass, where v^2 = |<x', y'>|^2.
            This is calculated by the dot product between a mass vector and |velocity| squared vector scaled by 0.5
        """
        (m1, m2, l1, l2, a1, a2, w1, w2) = self.masses + self.lengths + self.angles + self.omegas
        x_prime = np.cumsum([w1 * l1 * cos(a1), w2 * l2 * cos(a2)])
        y_prime = np.cumsum([w1 * l1 * sin(a1), w2 * l2 * sin(a2)])
        v1_squared = np.linalg.norm([x_prime[0], y_prime[0]]) ** 2
        v2_squared = np.linalg.norm([x_prime[1], y_prime[1]]) ** 2
        velocity_vector = np.asarray([v1_squared, v2_squared])
        KE = 0.5 * velocity_vector.dot([m1, m2])  # 0.5 * m * v_squared
        return KE

    def get_omega_prime(self, state, t):
        """
            Finds the omega prime using 2 different methods (dependent on self.optimize). If true, the function
            uses the analytical solution solved for omega prime to speed up the calculation. If false, the
            function directly uses the results of the Euler-Lagrange equations within a matrix to solve for omega prime
        """
        (m1, m2, l1, l2) = self.masses + self.lengths
        self.angles = (state[0], state[2])
        self.omegas = (state[1], state[3])
        (a1, a2, w1, w2) = self.angles + self.omegas
        g = 9.8

        if self.optimize:
            # Equations pre-solved for w1' and w2' found here: https://www.myphysicslab.com/pendulum/double-pendulum-en.html
            den1 = (m1 + m2) * l1 - m2 * l1 * cos(a2 - a1) * cos(a2 - a1)
            num1 = m2 * l1 * w1 * w1 * sin(a2 - a1) * cos(a2 - a1) + m2 * g * sin(a2) * cos(
                a2 - a1) + m2 * l2 * w2 * w2 * sin(a2 - a1) - (m1 + m2) * g * sin(a1)

            num2 = -m2 * l2 * w2 * w2 * sin(a2 - a1) * cos(a2 - a1) + (m1 + m2) * g * sin(a1) * cos(a2 - a1) - (
                    m1 + m2) * l1 * w1 * w1 * sin(a2 - a1) - (m1 + m2) * g * sin(a2)
            den2 = (m1 + m2) * l2 - m2 * l2 * cos(a2 - a1) * cos(a2 - a1)

            omega_prime = [w1, num1 / den1, w2, num2 / den2]
        else:
            # coefficients and terms from Euler-Lagrange Equations
            A1 = (m1 + m2) * l1
            B1 = m2 * l2 * cos(a1 - a2)
            C1 = -(m1 + m2) * g * sin(a1) - m2 * l2 * w2 * w2 * sin(a1 - a2)

            A2 = m2 * l1 * cos(a1 - a2)
            B2 = m2 * l2 * l2
            C2 = m2 * l1 * w1 * w1 * sin(a1 - a2) - m2 * g * sin(a2)

            # Creating a matrix to solve equations for w1' and w2' with rref
            mat = sp.Matrix([[A1, B1, C1], [A2, B2, C2]]).rref()[0]

            omega_prime = [w1, mat[0, 2], w2, mat[1, 2]]

        return omega_prime

    def step(self, dt):
        """
            Solves the Diff EQ over given step dt using the 4th order Runge-Kutta algorithm, and updates
            the current state (angles, omegas) of the system accordingly
        """
        self.state = integrate.odeint(self.get_omega_prime, self.state, [0, dt])[1]
        self.time_elapsed = self.time_elapsed + dt
